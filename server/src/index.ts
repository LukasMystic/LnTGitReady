    import express, { Express, Request, Response, NextFunction } from 'express';
    import dotenv from 'dotenv';
    import cors from 'cors';
    import mongoose from 'mongoose';
    import Registration from './models/Registration';
    import Settings from './models/Settings';
    
    dotenv.config();
    
    const app: Express = express();
    const port = process.env.PORT || 8080;
    
    const adminCredentials = JSON.parse(process.env.ADMIN_CREDENTIALS || '{}');

    
    const ADMIN_ACCESS_TOKEN = "secret-admin-token-12345";
    
    // --- Middleware ---
    app.use(cors({
        origin: [
            'https://lnt-git-ready.vercel.app',     // client
            'https://ln-t-git-ready.vercel.app',// admin
            'https://lnt-git-ready-user.vercel.app' // server
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
        }));

    app.use(express.json());
    
    // --- MongoDB Connection ---
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
        console.error("MONGO_URI is not defined in the .env file. Please add it.");
        process.exit(1);
    }
    
    mongoose.connect(mongoUri)
        .then(() => console.log("MongoDB connected successfully."))
        .catch(err => {
            console.error("MongoDB connection error:", err);
            process.exit(1);
        });
    
    // --- Middleware for Admin Authentication ---
    const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization'];
        if (token === `Bearer ${ADMIN_ACCESS_TOKEN}`) {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized: Access is denied." });
        }
    };
    
    
    // --- API Routes ---
    
    app.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server is running! 🚀');
    });
    
    app.post('/api/register', async (req: Request, res: Response) => {
        try {
            const settings = await Settings.findOne({ name: 'mainSettings' });
            if (settings && !settings.isRegistrationOpen) {
                return res.status(403).json({ message: "Maaf, pendaftaran saat ini sedang ditutup." });
            }
    
            const { fullName, nim, binusianEmail, privateEmail, major, phoneNumber } = req.body;
    
            if (!fullName || !nim || !binusianEmail || !privateEmail || !major || !phoneNumber) {
                return res.status(400).json({ message: "Please fill all required fields." });
            }
    
            const existingUser = await Registration.findOne({ $or: [{ nim }, { binusianEmail }] });
            if (existingUser) {
                const message = existingUser.nim === nim 
                    ? "A registration with this NIM already exists."
                    : "A registration with this Binusian Email already exists.";
                return res.status(409).json({ message });
            }
    
            const newRegistration = new Registration({
                fullName, nim, binusianEmail, privateEmail, major, phoneNumber
            });
            await newRegistration.save();
    
            res.status(201).json({ 
                message: "Registration successful!", 
                data: { id: newRegistration._id, fullName: newRegistration.fullName } 
            });
    
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Validation Error", details: error.message });
            }
            console.error("Registration error:", error);
            res.status(500).json({ message: "An unexpected server error occurred." });
        }
    });
    
    app.get('/api/settings/status', async (req: Request, res: Response) => {
        try {
            let settings = await Settings.findOne({ name: 'mainSettings' });
            if (!settings) {
                settings = await new Settings().save();
            }
            res.json({ isRegistrationOpen: settings.isRegistrationOpen });
        } catch (error) {
            res.status(500).json({ message: "Server error fetching settings." });
        }
    });
    
    
    // --- Admin Routes ---
    
    app.post('/api/admin/login', (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        if (adminCredentials[email as keyof typeof adminCredentials] === password) {
            res.json({ message: "Login successful!", token: ADMIN_ACCESS_TOKEN });
        } else {
            res.status(401).json({ message: "Invalid email or password." });
        }
    });
    
    app.get('/api/admin/registrations', requireAdminAuth, async (req: Request, res: Response) => {
        try {
            const registrations = await Registration.find().sort({ registrationDate: -1 });
            res.json(registrations);
        } catch (error) {
            res.status(500).json({ message: "Server error while fetching registrations." });
        }
    });
    
    app.put('/api/admin/registrations/:id', requireAdminAuth, async (req: Request, res: Response) => {
        try {
            const updatedRegistration = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!updatedRegistration) return res.status(404).json({ message: 'Registration not found.' });
            res.json({ message: 'Registration updated successfully.', data: updatedRegistration });
        } catch (error: any) {
            res.status(500).json({ message: 'Server error while updating registration.' });
        }
    });
    
    app.delete('/api/admin/registrations/:id', requireAdminAuth, async (req: Request, res: Response) => {
        try {
            const deletedRegistration = await Registration.findByIdAndDelete(req.params.id);
            if (!deletedRegistration) return res.status(404).json({ message: 'Registration not found.' });
            res.json({ message: 'Registration deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Server error while deleting registration.' });
        }
    });
    
    app.post('/api/admin/settings/toggle', requireAdminAuth, async (req: Request, res: Response) => {
        try {
            let settings = await Settings.findOne({ name: 'mainSettings' });
            if (!settings) {
                settings = new Settings();
            }
            settings.isRegistrationOpen = !settings.isRegistrationOpen;
            await settings.save();
            res.json({ isRegistrationOpen: settings.isRegistrationOpen });
        } catch (error) {
            res.status(500).json({ message: "Server error toggling settings." });
        }
    });
    
    // --- Start the Server ---
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
    