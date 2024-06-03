# Video Conferencing Web Application
## Overview
This project is a web-based video conferencing application that allows users to join virtual channels, interact with video and audio, and send text messages in real-time. It's designed to be user-friendly and intuitive, providing essential features for a seamless conferencing experience.

## Features

### User Login:
Enter your name and the channel you want to join.\
If the channel does not exist, it will be created automatically.\
Ensure that your friends enter the same channel name to join the same session.

### Video Screen:
View all active participants in the channel.\
The currently speaking participant is highlighted in yellow.

### Control Buttons (located at the top):
Mute/Unmute: Toggle your microphone on or off.\
Turn Camera On/Off: Enable or disable your video feed.

### View Mode:
Grid View: All participants are displayed in equal-sized tiles.
Spotlight View: The active speaker is enlarged, with other participants shown in smaller tiles at the top.

## Chat Box (located on the right side):
Send and receive text messages with all active users in the channel.

# Implementation
The video call feature is implemented using agoraRTC and for the chatting agoraRTM(Signaling) is used.\
For token generation a backend server is running on nitinsingh.in to generate rtc and rtm tokens as well as to keep to user names.
