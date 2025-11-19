import express from "express";
    
const router = express.Router();


router.get("/", (req, res) => {
    // complete implementation
    res.json({ message: "List of resources", data: [] });
});

router.get("/:id", (req, res) => {
    // complete implementation
    res.json({ message: `Details for resource ${req.params.id}`, data: {} });
});

router.post("/", (req, res) => {
    // complete implementation
    res.status(201).json({ message: "Resource created", data: req.body });
});

router.put("/:id", (req, res) => {
    // complete implementation
    res.json({ message: `Resource ${req.params.id} updated`, data: req.body });
});

router.delete("/:id", (req, res) => {
    // complete implementation
    res.json({ message: `Resource ${req.params.id} deleted` });
});

    
export { router as resourcesRouter };