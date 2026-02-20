import { UserRole } from '../constants/roles';
import { prisma } from '../lib/prisma';
import { PUBLIC_APP_URL, PUBLIC_BETTER_AUTH_URL } from '../config/env';

async function seedAdmin() {
    try {
        const adminData = {
            name: "Al-mizan",
            email: "20220654955almizan@juniv.edu",
            role: UserRole.ADMIN,
            password: "12345678",
        }
        const userExists = await prisma.user.findUnique({
            where: { email: adminData.email },
        });

        if (userExists) {
            throw new Error("Admin user already exists");
        }

        const signUpAdmin = await fetch(`${PUBLIC_BETTER_AUTH_URL}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": PUBLIC_APP_URL as string
            },
            body: JSON.stringify(adminData)
        })

        console.log(signUpAdmin);

        if(signUpAdmin.ok) {
            await prisma.user.update({
                where: { email: adminData.email },
                data: { emailVerified: true }
            })
        }

    } catch (error) {
        console.error("Error seeding admin user:", error as Error);
    }
}

seedAdmin();