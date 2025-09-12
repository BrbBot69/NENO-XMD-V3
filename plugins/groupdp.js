const { cmd } = require("../command");

// Group Info Command
cmd(
  {
    pattern: "groupinfo",
    alias: ["ginfo"],
    react: "🐔",
    desc: "Get group information",
    category: "group",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      if (!m.isGroup) return reply("❌ This command works only in groups.");

      const groupMeta = await malvin.groupMetadata(from);

      let infoText = `📌 *Group Info*\n\n`;
      infoText += `*Name:* ${groupMeta.subject}\n`;
      infoText += `*ID:* ${groupMeta.id}\n`;
      infoText += `*Members:* ${groupMeta.participants.length}\n\n`;
      infoText += `*Members List:*\n`;

      groupMeta.participants.forEach((p, i) => {
        const role = p.admin === "admin" ? "👮 Admin" : p.admin === "superadmin" ? "👑 Owner" : "👤 Member";
        infoText += `${i + 1}. ${p.id.split("@")[0]} ${role}\n`;
      });

      let icon;
      try {
        icon = await malvin.profilePictureUrl(from, "image");
      } catch {
        icon = null;
      }

      await malvin.sendMessage(
        from,
        { 
          image: icon ? { url: icon } : null, 
          caption: infoText 
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("Group Info Error:", e.message);
      reply(`❌ Error fetching group info:\n${e.message}`);
    }
  }
);

// Group Members DP Command
cmd(
  {
    pattern: "gmdp",
    alias: ["groupdp"],
    react: "🐔",
    desc: "Get all members DP with random captions (Admins special captions)",
    category: "group",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      if (!m.isGroup) return reply("❌ This command works only in groups.");

      const groupMeta = await malvin.groupMetadata(from);
      await reply(`📸 Fetching DPs of ${groupMeta.participants.length} members...`);

      // Captions for normal members
      const normalCaptions = [
        "🔥 Looking cool!",
        "😎 The legend of the group",
        "🌸 Always shining bright",
        "😂 Meme king/queen",
        "🐔 Chicken vibes only",
        "💎 Rare gem spotted",
        "🎭 Mystery person here",
        "🚀 Going to the moon",
        "🍀 Lucky charm of the squad",
        "👑 Royal member",
        "📢 Always online 😂",
        "🎶 Brings the vibe",
        "🤖 Future AI master",
      ];

      // Captions for admins
      const adminCaptions = [
        "👑 The Boss of this group",
        "🛡️ Protector of the squad",
        "🔥 Admin vibes only",
        "📌 The decision maker",
        "💼 Always in control",
        "⚡ Power user detected",
        "🚨 Group law & order",
        "🌟 Supreme Leader",
        "🐲 Silent but powerful",
      ];

      for (const member of groupMeta.participants) {
        try {
          const dpUrl = await malvin.profilePictureUrl(member.id, "image");
          if (dpUrl) {
            // Check if member is admin
            const isAdmin = member.admin === "admin" || member.admin === "superadmin";

            // Select random caption depending on role
            const randomCaption = isAdmin
              ? adminCaptions[Math.floor(Math.random() * adminCaptions.length)]
              : normalCaptions[Math.floor(Math.random() * normalCaptions.length)];

            // Send DP with caption + tag
            await malvin.sendMessage(
              from,
              {
                image: { url: dpUrl },
                caption: `${randomCaption}\n@${member.id.split("@")[0]}`,
                mentions: [member.id],
              },
              { quoted: mek }
            );
          }
        } catch {
          continue; // skip if no DP
        }
      }
    } catch (e) {
      console.error("GMDP Error:", e.message);
      reply(`❌ Error fetching members' DP:\n${e.message}`);
    }
  }
);
