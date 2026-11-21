const express= require("express"); //require() nodejs ka func h yaha ye express package import kar rha h

const app=express();//express  appl. create kr rhe h

app.use(express.json());//middleware add kiya kyki jab frontend json data bhejega to express ko us data ko read karna hoga

const PORT=3000; //communic. endpoint jahan server req listen karega
//home route
app.get("/",(req,res)=>{
    res.send("NexaCart User Service is running");
});
//get all user
app.get("/users",(req,res)=>{
    res.send("All users")
});

app.get("/users/profile",(req,res)=>{
    res.send("User profile");
});
app.get("/users/:id",(req,res)=>{
    res.send(req.params.id);
});


//post
app.post("/users/register",(req,res)=>{
    console.log("REGISTER ROUTE HIT");
    const user= req.body;
    res.json({
        message:"User registered successfully",
        data:user
    })
});

app.put("/users/:id", (req,res) => {
    const userId=req.params.id;
    const updatedData=req.body;

    res.json({
        message: "User updated successfully",
        id: userId,
        data: updatedData
    });
});

app.patch("/users/:id",(req,res)=>{
    const userId=req.params.id;
    const updatedData=req.body;

    res.json({
        message:"User partially updated",
        id:userId,
        data:updatedData
    });
});

app.delete("/users/:id",(req,res)=>{
    const userId=req.params.id;

    res.json({
        message:"User deleted successfully",
        id:userId
    });
});

app.listen(PORT,()=>{ //server start karta h
    console.log("User Service running on port ${PORT}");
});