"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signupbody = void 0;
const zod_1 = require("zod");
exports.Signupbody = zod_1.z.object({
    username: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().min(6, { message: "Password must be of 6 letters" }),
});
//# sourceMappingURL=auth.js.map