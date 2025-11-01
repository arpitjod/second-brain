import {z} from "zod";

export const Signupbody=z.object({
    username:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be of 6 letters"}),   
});
export type SignupInput=z.infer<typeof Signupbody>;
