import { z } from "zod";
export declare const Signupbody: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof Signupbody>;
//# sourceMappingURL=auth.d.ts.map