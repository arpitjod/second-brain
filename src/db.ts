import mongoose,{model,Schema} from "mongoose";

mongoose.connect("mongodb+srv://officialarpit7:XeQKLot1l0jbr892@cluster0.ay15zyk.mongodb.net/Brainly?retryWrites=true&w=majority&appName=Cluster0");
const UserSchema=new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},

});
export const UserModel=model("User",UserSchema); 
