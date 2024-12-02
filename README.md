
---

# Real-Time Speech-to-Speech Translation Using Agora and OpenAI

This project enables real-time multilingual communication through speech translation, leveraging Agora for low-latency video/audio and OpenAI for translation and transcription. 

---

## Frontend Instructions

### Installation

- **Install Dependencies**:  
  Run `npm install` to install all required packages.

- **Start Development Environment**:  
  Run `npm run start` to launch the development server.

- **Build for Production**:  
  Run `npm run build` to compile the project for production.

### Configuration

- To switch environments, edit the **apiEndpoints.ts file**.  
  Set the BASE_URL to your desired environment.

---

## Application Flow

### Joining a Meeting

1. **Select Your Language**:  
   Choose the language you want to speak and listen to from the dropdown menu.  
   Example: Selecting **English** allows you to speak in English, and translations will be displayed in English as others speak in their chosen languages.

2. **Enter Your Details**:  
   - **Username**: Enter your name.  
   - **Channel Name**: Specify the meeting channel. *(Note: Channel names are case-sensitive; e.g., "Hello" and "hello" are treated as different channels.)*

3. **Join the Meeting**:  
   Click **Login** to join the specified channel.

---

### Meeting Interface Overview

1. **Video Stream (Center Panel)**:
   - Displays live video feeds of all participants.  
   - Each video feed shows the participant’s name and the latest translation of their speech in your selected language.

2. **Transcription History (Right Panel)**:
   - A detailed transcription panel showing all spoken content in the meeting.  
   - Includes timestamps, speaker names, and your translations highlighted in **blue**.

3. **Meeting Room Controls (Bottom Panel)**:
   - **Mute/Unmute**: Control your microphone.  
   - **Start/Stop Video**: Manage your video feed.  
   - **Leave Meeting**: Exit the meeting.  
   - **Info Icon**: Access platform information and usage guidelines.  
   - **Advanced Settings**: Adjust the volume balance between original and translated speech.

---

Feel free to suggest or contribute to this project!

--- 

## How It Works  

### Overview  

1. **Joining the Agora RTN Channel**:  
   - When a user logs in, they are added to an Agora Real-Time Network (RTN) channel via the Agora RTC SDK using the specified channel name.  
   - Their video and audio streams are published to the channel.  
   - If the specified channel does not exist, it is automatically created.  

2. **Agent Creation and Functionality**:  
   - Multiple AI agents are generated and added to the same channel to handle translation and transcription for all users in the meeting.  
   - Each agent is responsible for translating the user’s audio into a specific target language and broadcasting the translated audio back into the channel.  

3. **Language-Based Audio Subscription**:  
   - The frontend subscribes only to agents translating into the user’s selected language.  
   - Example: If a user selects **English**, they will only hear agents translating to English, while agents translating to other languages are ignored.  

4. **Direct Connections for Shared Languages**:  
   - If two users speak the same language, they are directly connected without requiring an intermediary translation agent.  

---

### Agent Identification  

Agents and users in the meeting are uniquely identified by their UIDs:  

- **User UID**:  
  - Users are assigned a 4-digit integer UID.  

- **Agent UID**:  
  - Agents are assigned an 8-digit UID formatted as follows:  
    **(4-digit User UID) + (2-digit Source Language Code) + (2-digit Target Language Code)**  
  - Example: A user with UID `1234` speaking English (`01`) and having their audio translated to Spanish (`02`) will have an agent UID of `12340102`.  

  - Language codes can be found in the `botCode.ts` file, structured as:  
    ```typescript
    { name: 'Arabic', code: '02' }
    ```  

  - The frontend can parse agent UIDs to identify the user, source language, and target language.  

---

### Transcription and Messaging  

- **Transcription Broadcast**:  
  - Transcriptions are sent as stream messages within the channel by the agent.  
  - The agent’s UID is used to identify the user and the language of the transcription.  

- **Frontend Behavior**:  
  - The frontend subscribes only to agents translating to the user’s selected language.  
  - Transcriptions from other agents are ignored.  

---

### Agent Management  

- When a user leaves the channel, their corresponding agents are removed.  

- For detailed information about agent creation and lifecycle management, refer to the backend service documentation linked below:  
  - **NodeJS Service**: Responsible for token generation and AI agent management. [Link Will Be Added soon]
  - **Python Service**: Built on Agora-OpenAI-PythonSDK for agent creation and channel management for audio translation. [Link Will Be Added soon]  

---
