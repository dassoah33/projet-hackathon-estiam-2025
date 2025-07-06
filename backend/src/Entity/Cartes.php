<?php

namespace App\Entity;

use App\Repository\CartesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]

#[ORM\Entity(repositoryClass: CartesRepository::class)]
class Cartes
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $Token = null;

    #[ORM\Column(nullable: true)]
    private ?bool $Etat = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Num_Carte = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $CreatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->Token;
    }

    public function setToken(string $Token): static
    {
        $this->Token = $Token;

        return $this;
    }

    public function isEtat(): ?bool
    {
        return $this->Etat;
    }

    public function setEtat(?bool $Etat): static
    {
        $this->Etat = $Etat;

        return $this;
    }

    public function getNumCarte(): ?string
    {
        return $this->Num_Carte;
    }

    public function setNumCarte(?string $Num_Carte): static
    {
        $this->Num_Carte = $Num_Carte;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->CreatedAt;
    }

    public function setCreatedAt(\DateTimeImmutable $CreatedAt): static
    {
        $this->CreatedAt = $CreatedAt;

        return $this;
    }
}
