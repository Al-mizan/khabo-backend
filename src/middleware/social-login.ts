import { Request, Response } from "express";
import { auth } from "../lib/auth";

export const socialLogin = async (req: Request, res:Response) => {
    try {
        const { provider, callbackURL } = req.query;
        if (!provider || !callbackURL) {
            return res.status(400).json({ error: 'Missing provider or callbackURL' });
        }

        const response = await auth.api.signInSocial({
            body: {
                provider: provider as string,
                callbackURL: callbackURL as string,
            },
            asResponse: true,
            headers: new Headers({
                host: req.headers.host || '',
                'x-forwarded-proto': req.headers['x-forwarded-proto'] as string || 'https',
            }),
        });

        // Forward Set-Cookie headers from Better Auth response
        const cookies = response.headers.getSetCookie();
        cookies.forEach((cookie: string) => {
            res.append('Set-Cookie', cookie);
        });

        // Follow redirect or extract URL from JSON body
        const location = response.headers.get('location');
        if (location) {
            return res.redirect(location);
        }

        const data = await response.json();
        if (data.url) {
            return res.redirect(data.url);
        }

        res.status(400).json({ error: 'Failed to initiate social login' });
    } catch (error: unknown) {
        console.error('Social login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}