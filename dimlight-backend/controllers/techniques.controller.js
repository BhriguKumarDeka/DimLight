const Technique = require("../models/Technique");

exports.getAllTechniques = async (req, res) => {
  try {
    const techniques = await Technique.find();
    res.json({ techniques });
  } catch (err) {
    console.error("Fetch techniques error:", err);
    res.status(500).json({ message: "Error fetching techniques" });
  }
};

exports.getTechniqueById = async (req, res) => {
  try {
    const { id } = req.params;
    const technique = await Technique.findById(id);
    if (!technique) {
      return res.status(404).json({ message: "Technique not found" });
    }
    res.json({ technique });
  } catch (err) {
    console.error("Fetch technique by id error:", err);
    res.status(500).json({ message: "Error fetching technique" });
  }
};

exports.getTechniqueByType = async (req, res) => {
  try {
    const { type } = req.params;

    const techniques = await Technique.find({ type });
    res.json({ techniques });
  } catch (err) {
    console.error("Fetch by type error:", err);
    res.status(500).json({ message: "Error fetching techniques" });
  }
};

exports.getRecommendedTechniques = async (req, res) => {
  try {
    const { concern } = req.query;

    const techniques = await Technique.find({
      recommendedFor: concern
    });

    res.json({ techniques });
  } catch (err) {
    console.error("Fetch recommended error:", err);
    res.status(500).json({ message: "Error fetching recommended techniques" });
  }
};
