import mongoose,{model,Schema} from "mongoose";

mongoose.connect("mongodb+srv://officialarpit7:XeQKLot1l0jbr892@cluster0.ay15zyk.mongodb.net/Brainly?retryWrites=true&w=majority&appName=Cluster0");
const UserSchema=new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},

});
export const UserModel=model("User",UserSchema);

const ContentSchema=new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:"Tag"}],
    type:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
})
const LinkSchema = new Schema({
    hash: String,
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true,unique:true}
})
export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);