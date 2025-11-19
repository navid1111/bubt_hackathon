import express from "express";
    
const router = express.Router();


router.get("/", (req, res) => {
    // complete implementation
    res.json({ message: "List of foods", data: [] });
});

router.get("/:id", (req, res) => {
    // complete implementation
    res.json({ message: `Details for food ${req.params.id}`, data: {} });
});

router.post("/", (req, res) => {
    // complete implementation
    res.status(201).json({ message: "Food created", data: req.body });
});

router.put("/:id", (req, res) => {
    // complete implementation
    res.json({ message: `Food ${req.params.id} updated`, data: req.body });
});

router.delete("/:id", (req, res) => {
    // complete implementation
    res.json({ message: `Food ${req.params.id} deleted` });
});

    
export { router as foodsRouter };