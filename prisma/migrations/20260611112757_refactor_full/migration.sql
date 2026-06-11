/*
  Warnings:

  - You are about to drop the column `fournisseur` on the `PieceDetachee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN "ice" TEXT;
ALTER TABLE "Client" ADD COLUMN "ville" TEXT;

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "ice" TEXT,
    "contact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BureauExpertise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "contact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Partenaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Devis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "vehiculeId" TEXT,
    "ordreId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "validite" INTEGER NOT NULL DEFAULT 30,
    "montantHT" REAL NOT NULL DEFAULT 0,
    "tva" REAL NOT NULL DEFAULT 20,
    "montantTTC" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "dateEmission" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Devis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Devis_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Devis_ordreId_fkey" FOREIGN KEY ("ordreId") REFERENCES "OrdreReparation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneDevis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "devisId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" REAL NOT NULL DEFAULT 1,
    "prixUnitaire" REAL NOT NULL,
    "pieceId" TEXT,
    CONSTRAINT "LigneDevis_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "Devis" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneDevis_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "PieceDetachee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonCommande" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "fournisseurId" TEXT,
    "clientId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "montantHT" REAL NOT NULL DEFAULT 0,
    "tva" REAL NOT NULL DEFAULT 20,
    "montantTTC" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "dateEmission" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLivraison" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BonCommande_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BonCommande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneBonCommande" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" REAL NOT NULL DEFAULT 1,
    "prixUnitaire" REAL NOT NULL,
    "pieceId" TEXT,
    CONSTRAINT "LigneBonCommande_bonId_fkey" FOREIGN KEY ("bonId") REFERENCES "BonCommande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneBonCommande_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "PieceDetachee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonLivraison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "bonCommandeId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "adresse" TEXT,
    "notes" TEXT,
    "dateEmission" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLivraison" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BonLivraison_bonCommandeId_fkey" FOREIGN KEY ("bonCommandeId") REFERENCES "BonCommande" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FicheTechnique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "typeControle" TEXT NOT NULL,
    "observations" TEXT,
    "resultat" TEXT,
    "technicien" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FicheTechnique_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttestationImmobilisation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AttestationImmobilisation_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcesVerbal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "clientId" TEXT,
    "bureauExpertiseId" TEXT,
    "typeExpertise" TEXT NOT NULL,
    "description" TEXT,
    "constatations" TEXT,
    "conclusion" TEXT,
    "montantExpertise" REAL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcesVerbal_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcesVerbal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcesVerbal_bureauExpertiseId_fkey" FOREIGN KEY ("bureauExpertiseId") REFERENCES "BureauExpertise" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JournalEntree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "compte" TEXT NOT NULL DEFAULT 'Caisse',
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Facture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "ordreId" TEXT,
    "devisId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "montantHT" REAL NOT NULL,
    "tva" REAL NOT NULL DEFAULT 20,
    "montantTTC" REAL NOT NULL,
    "dateEmission" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEcheance" DATETIME,
    "datePaiement" DATETIME,
    "modePaiement" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Facture_ordreId_fkey" FOREIGN KEY ("ordreId") REFERENCES "OrdreReparation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Facture_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "Devis" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Facture" ("clientId", "createdAt", "dateEcheance", "dateEmission", "datePaiement", "id", "modePaiement", "montantHT", "montantTTC", "notes", "numero", "ordreId", "statut", "tva", "updatedAt") SELECT "clientId", "createdAt", "dateEcheance", "dateEmission", "datePaiement", "id", "modePaiement", "montantHT", "montantTTC", "notes", "numero", "ordreId", "statut", "tva", "updatedAt" FROM "Facture";
DROP TABLE "Facture";
ALTER TABLE "new_Facture" RENAME TO "Facture";
CREATE UNIQUE INDEX "Facture_numero_key" ON "Facture"("numero");
CREATE UNIQUE INDEX "Facture_ordreId_key" ON "Facture"("ordreId");
CREATE UNIQUE INDEX "Facture_devisId_key" ON "Facture"("devisId");
CREATE TABLE "new_OrdreReparation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "clientId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "typeService" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "dateEntree" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSortie" DATETIME,
    "kilometrage" INTEGER,
    "technicienId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrdreReparation_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdreReparation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrdreReparation_technicienId_fkey" FOREIGN KEY ("technicienId") REFERENCES "Personnel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrdreReparation" ("createdAt", "dateEntree", "dateSortie", "description", "id", "kilometrage", "numero", "statut", "technicienId", "typeService", "updatedAt", "vehiculeId") SELECT "createdAt", "dateEntree", "dateSortie", "description", "id", "kilometrage", "numero", "statut", "technicienId", "typeService", "updatedAt", "vehiculeId" FROM "OrdreReparation";
DROP TABLE "OrdreReparation";
ALTER TABLE "new_OrdreReparation" RENAME TO "OrdreReparation";
CREATE UNIQUE INDEX "OrdreReparation_numero_key" ON "OrdreReparation"("numero");
CREATE TABLE "new_PieceDetachee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "categorie" TEXT NOT NULL,
    "quantiteStock" INTEGER NOT NULL DEFAULT 0,
    "seuilAlerte" INTEGER NOT NULL DEFAULT 5,
    "prixAchat" REAL NOT NULL,
    "prixVente" REAL NOT NULL,
    "fournisseurId" TEXT,
    "emplacement" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PieceDetachee_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PieceDetachee" ("categorie", "createdAt", "description", "emplacement", "id", "nom", "prixAchat", "prixVente", "quantiteStock", "reference", "seuilAlerte", "updatedAt") SELECT "categorie", "createdAt", "description", "emplacement", "id", "nom", "prixAchat", "prixVente", "quantiteStock", "reference", "seuilAlerte", "updatedAt" FROM "PieceDetachee";
DROP TABLE "PieceDetachee";
ALTER TABLE "new_PieceDetachee" RENAME TO "PieceDetachee";
CREATE UNIQUE INDEX "PieceDetachee_reference_key" ON "PieceDetachee"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Devis_numero_key" ON "Devis"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Devis_ordreId_key" ON "Devis"("ordreId");

-- CreateIndex
CREATE UNIQUE INDEX "BonCommande_numero_key" ON "BonCommande"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "BonLivraison_numero_key" ON "BonLivraison"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "BonLivraison_bonCommandeId_key" ON "BonLivraison"("bonCommandeId");

-- CreateIndex
CREATE UNIQUE INDEX "FicheTechnique_numero_key" ON "FicheTechnique"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "AttestationImmobilisation_numero_key" ON "AttestationImmobilisation"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "ProcesVerbal_numero_key" ON "ProcesVerbal"("numero");
