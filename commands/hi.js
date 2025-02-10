const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Says hello with a random dog image!'),
    async execute(interaction) {
        try {
            // Get list of dog images
            const imagesDir = path.join(__dirname, '..', 'attached_assets');
            const files = await fs.readdir(imagesDir);
            const dogImages = files.filter(file => file.toLowerCase().includes('dog') && file.endsWith('.png'));

            // Randomly select an image
            const randomImage = dogImages[Math.floor(Math.random() * dogImages.length)];
            const imagePath = path.join(imagesDir, randomImage);

            // Create embed with the image
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Hello! 🐕')
                .setImage(`attachment://${randomImage}`)
                .setTimestamp();

            // Send the response with the attached image
            await interaction.reply({
                embeds: [embed],
                files: [{
                    attachment: imagePath,
                    name: randomImage
                }]
            });
        } catch (error) {
            console.error('Error executing hi command:', error);
            await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
        }
    },
};