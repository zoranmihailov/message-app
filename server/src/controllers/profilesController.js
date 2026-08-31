import prisma from "../db/client.js";

export async function getAllProfiles(req, res) {
  try {
    const profiles = await prisma.profile.findMany({
      select: { id: true, username: true, name: true, imageUrl: true, lastSeenAt: true },
    });
    res.json(profiles);
  } catch (error) {
    console.error('Error in getting profiles:', error);
    res.status(500).json({ error: 'Error in the server' });
  }
}

export async function getProfile(req, res) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true,
        name: true,
        imageUrl: true,
        bio: true,
        edu: true,
        lastSeenAt: true,
      },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    console.error('Error in getting profile:', error);
    res.status(500).json({ error: 'Error in the server' });
  }
}

export async function updateProfile(req, res) {
  try {
    const id = req.params.id;

    if (req.session.userId !== id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, bio, edu, imageUrl } = req.body;
    const updated = await prisma.profile.update({
      where: { id },
      data: { name, bio, edu, imageUrl },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ error: "Error in the server" });
  }
}