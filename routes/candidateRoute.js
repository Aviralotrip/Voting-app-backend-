const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidateModel");
const User = require("../models/userModel");
const jwtAuthMiddleware = require("../jwt").jwtAuthMiddleware; // Adjust the import if necessary

// Check if User is admin or not
const checkRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user && user.role === "admin";
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error");
    }
};

// Get all candidates route
router.get("/list", async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party -_id');
        res.json(candidates);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// POST route to add a new candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (await checkRole(req.user.id)) {
            const { name, age, party } = req.body;
            const newCandidate = new Candidate({ name, age, party });
            await newCandidate.save();
            res.status(201).json({ message: "Candidate added successfully" });
        } else {
            res.status(403).json({ message: "User does not have permission to add candidate" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update the candidate
router.put('/:ID', jwtAuthMiddleware, async (req, res) => {
    try {
        const candidateID = req.params.ID;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Voting route
router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin cannot vote" });
        }

        if (user.isVoted) {
            return res.status(400).json({ message: "User has already voted" });
        }

        candidate.votes.push({
            user: userId,
            votedAt: Date.now()
        });
        candidate.voteCount++;
        user.isVoted = true;
        await user.save();
        await candidate.save();
        res.status(200).json({ message: "Voted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Vote count route
router.get('/vote/count', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });
        const votes = candidates.map((candidate) => ({
            party: candidate.party,
            voteCount: candidate.voteCount,
        }));
        res.status(200).json(votes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;