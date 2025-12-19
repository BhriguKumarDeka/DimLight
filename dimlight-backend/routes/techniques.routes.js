const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getAllTechniques,
  getTechniqueById,
  getTechniqueByType,
  getRecommendedTechniques
} = require("../controllers/techniques.controller");

router.get("/", auth, getAllTechniques);
router.get("/:id", auth, getTechniqueById);
router.get("/type/:type", auth, getTechniqueByType);
router.get("/recommended", auth, getRecommendedTechniques);

module.exports = router;
