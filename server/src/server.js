import dotenv from 'dotenv';
dotenv.config();
const { app } = await import('./app.js');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server works on port ${PORT}`));