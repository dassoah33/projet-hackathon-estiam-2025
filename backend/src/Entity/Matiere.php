<?php

namespace App\Entity;

use App\Repository\MatiereRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]

#[ORM\Entity(repositoryClass: MatiereRepository::class)]
class Matiere
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Name = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $Begin_Hour = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $End_Hour = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->Name;
    }

    public function setName(string $Name): static
    {
        $this->Name = $Name;

        return $this;
    }

    public function getBeginHour(): ?\DateTimeImmutable
    {
        return $this->Begin_Hour;
    }

    public function setBeginHour(\DateTimeImmutable $Begin_Hour): static
    {
        $this->Begin_Hour = $Begin_Hour;

        return $this;
    }

    public function getEndHour(): ?\DateTimeImmutable
    {
        return $this->End_Hour;
    }

    public function setEndHour(\DateTimeImmutable $End_Hour): static
    {
        $this->End_Hour = $End_Hour;

        return $this;
    }
}
