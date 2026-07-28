# ADR 001 — Choix de la stack 

Contexte : projet e-commerce testé, conteneurisé, CI/CD, à livrer en 4 jours. 

Décision : 
- Back : Node / Nest
- Base de données : Relationnelle -> PostgreSQL / Fortes relations entre utilisateurs, produits, paniers, commandes, paiements...
- ORM / accès données :  Prisma -> migrations et client simple pour utiliser avec Node
- Outils de test : Jest (unitaire) / Jest et supertest (intégration) / Cypress (E2E) 
- Front : Nextjs avec React pour 
- Justification : ......
- Conséquences : ...... 
