<p align="center">
  <h2 align="center">Movide IDE</h2>
  <p align="center"><b>Lightweight Move Program IDE</b></p>
  <p align="center">Comprehensive intuitive integrated development environment tailored for load smart contract from various blockchain and repositories</p>
</p>

## About Movide 

**Movide** is an open-source Move Integrated Development Environment (IDE) designed to empower developers, educators, and blockchain enthusiasts in their journey of smart contract development and exploration. This repository serves as the home for the Movide IDE.

## Documentation

To start using Movide, visit our [Documentation](https://docs.solide0x.tech/docs/ide/move-ide)

## Getting Started

To run Movide locally, follow these steps:

### Clone the Repository
First, clone the Movide repository to your local machine using Git:
```bash
git clone https://github.com/solide-project/movide
```

### Install Dependencies
Navigate into the cloned repository directory and install the required npm packages:
```bash
cd movide
bun install
```

### Install Backend Compiler
Next, install rust and sui cli and all the backend dependency for interacting with move
```bash
# Install SUI Cli
sudo apt-get install curl git-all cmake gcc libssl-dev pkg-config libclang-dev libpq-dev build-essential
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### Configure Environment Variables
Create a `.env.local` file in the root directory of the project and use the following template to fill in the required variables:
```
PROJECT_PATH=
GITHUB_API_KEY=
```

### Running Movide
After configuring the environment variables, start the Movide IDE:
```bash
bun run start
```

This command will launch the Movide IDE in your default web browser.

## Contribution Guidelines

We welcome contributions from the community to enhance Movide further. If you have suggestions, bug reports, or want to contribute code, please follow our [Contribution Guidelines](link-to-contribution-guidelines).

## Community and Support

Join the Movide community for discussions, support, and collaboration. Visit our [Discord channel (Coming Soon)](#) to connect with fellow developers and enthusiasts.

## License

Movide is released under the [MIT License](link-to-license). Feel free to use, modify, and distribute Movide for your projects.

---

Note: Movide is a community-driven project aimed at fostering openness, collaboration, and innovation in the blockchain development domain. Your feedback and contributions are highly valued. Let's build the future of smart contract development together!

Support us by starring this Repository and following us on [X](https://twitter.com/SolideProject)! 😊