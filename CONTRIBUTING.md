WARNING: This might not be up to date.

The structure of the bot goes as follows:
- Main script (index.js)
    - Main bot (src/index.js)
        - Registry (lib/Registry.js)
            - Commands (src/commands)
            - User data (loaded from src/users.json (moved to mongodb atlas))
            - Items
            - Clients
                - Discord Client (src/discord.js)
                - MPP Clients (src/mpp.js (rooms loaded from src/mpplist.json))
                - WebSocket Client (not made yet)
        - WebSocket Server (src/WSServer.js)
        - "load" functions
        - Database save scripts
