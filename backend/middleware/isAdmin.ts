import { Request, Response, NextFunction } from "express";
import adminEmailsJson from "../utils/admin-emails.json" assert { type: "json" };

const adminEmails: string[] = Array.isArray(adminEmailsJson)
	? adminEmailsJson
	: [];

export default function isAdmin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const email = req.headers["x-user-email"];

	if (!email || typeof email !== "string") {
		res.status(401).json({ message: "Admin email not provided" });
		return;
	}

	if (!adminEmails.includes(email)) {
		res.status(403).json({ message: "Access denied: not an admin" });
		return;
	}

	next();
}
