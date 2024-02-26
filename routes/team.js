// import User from "../models/profile"

// app.post('/api/user/:userId/followTeam', async (req, res) => {
//   const { userId } = req.params;
//   const { teamId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user.followedTeams.includes(teamId)) {
//       user.followedTeams.push(teamId);
//       await user.save();
//       res.send({ message: 'Team followed successfully' });
//     } else {
//       res.status(400).send({ message: 'Already following this team' });
//     }
//   } catch (error) {
//     res.status(500).send({ message: 'An error occurred', error: error.message });
//   }
// });