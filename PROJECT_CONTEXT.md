SlipMint Project Architecture

Organization:
xpert-global-systems

Repositories

1. slipmint-portal
    Purpose:
    Main Next.js frontend application.

Contains:

* Dashboard
* Authentication
* AI Chat UI
* Wallet Connection
* Founder Vault Interface
* Token Analytics
* Research Pages
* News Feed

2. slipmint-core
    Purpose:
    Backend core services and business logic.

Contains:

* API integrations
* User management
* Analytics services
* Vault calculations
* Market data processing
* Shared application logic

3. slipmint-ai
    Purpose:
    Artificial Intelligence platform.

Contains:

* Market analysis
* Research engine
* Content generation
* Signal generation
* AI chat responses
* Trading intelligence

4. xpert-token
    Purpose:
    Blockchain and smart contract layer.

Contains:

* XPERT token contracts
* Governance contracts
* Staking contracts
* Founder Vault contracts
* Treasury contracts

Architecture Flow

Frontend:
slipmint-portal

Frontend communicates with:

* slipmint-core
* slipmint-ai
* xpert-token smart contracts

Core services:
slipmint-core

AI services:
slipmint-ai

Blockchain:
xpert-token

Important Rules

* Never redesign the project as a new application.
* Never replace existing architecture.
* Extend existing repositories only.
* Preserve current API routes.
* Preserve current wallet integrations.
* Preserve current authentication flow.
* Preserve current smart contract integrations.
* Preserve Founder Vault functionality.
* Preserve XPERT token functionality.
* When generating code, assume all repositories work together.

Repository Relationships

slipmint-portal -> slipmint-core
slipmint-portal -> slipmint-ai
slipmint-portal -> xpert-token

slipmint-core -> slipmint-ai
slipmint-core -> xpert-token

slipmint-ai -> slipmint-core

xpert-token -> on-chain infrastructure

Development Rule

Before generating code:

1. Read this file.
2. Determine which repository owns the feature.
3. Modify only the appropriate repository.
4. Keep compatibility with all other repositories.
