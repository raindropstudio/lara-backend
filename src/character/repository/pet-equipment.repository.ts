import { Injectable } from '@nestjs/common';
import { PetEquipmentDataDto } from 'src/common/dto/pet-equipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PetEquipmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnorePetEquipment(characterId: number, petEquipmentData: PetEquipmentDataDto[]) {
    await this.prismaService.petEquipment.deleteMany({
      where: { characterId },
    });

    await this.prismaService.petEquipment.createMany({
      data: petEquipmentData.map(pet => ({
        characterId,
        petNo: pet.petNo,
        petName: pet.petInfo.petName,
        petNickname: pet.petInfo.petNickname,
        petIcon: pet.petInfo.petIcon,
        petDescription: pet.petInfo.petDescription,
        itemName: pet.petInfo.petEquipment?.itemName,
        itemIcon: pet.petInfo.petEquipment?.itemIcon,
        itemDescription: pet.petInfo.petEquipment?.itemDescription,
        attackPower: pet.petInfo.petEquipment?.attackPower,
        magicPower: pet.petInfo.petEquipment?.magicPower,
        scrollUpgrade: pet.petInfo.petEquipment?.scrollUpgrade,
        scrollUpgradable: pet.petInfo.petEquipment?.scrollUpgradable,
        itemShape: pet.petInfo.petEquipment?.itemShape,
        itemShapeIcon: pet.petInfo.petEquipment?.itemShapeIcon,
        autoSkill1: pet.petInfo.petAutoSkill?.skill1,
        autoSkill1Icon: pet.petInfo.petAutoSkill?.skill1Icon,
        autoSkill2: pet.petInfo.petAutoSkill?.skill2,
        autoSkill2Icon: pet.petInfo.petAutoSkill?.skill2Icon,
        petSkills: pet.petInfo.petSkills ? JSON.stringify(pet.petInfo.petSkills) : '[]',
        petType: pet.petInfo.petType,
        petDateExpire: pet.petInfo.petDateExpire ? new Date(pet.petInfo.petDateExpire) : null,
        petAppearance: pet.petInfo.petAppearance || '',
        petAppearanceIcon: pet.petInfo.petAppearanceIcon || '',
      })),
    });
  }
}
