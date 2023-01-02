import express from "express";

const PORT = 4000;

const app = express();

const handleHome = () =>console.log("Somebody is trying to go home");
app.get("/", handleHome, (req,res) => {
    console.log(res);
});

app.listen(PORT, ()=>{
    console.log(`✅ Server Listening on port http://localhost:${PORT}`);
});