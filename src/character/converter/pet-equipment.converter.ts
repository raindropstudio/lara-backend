// converter/pet-equipment.converter.ts

import { PetEquipment, Prisma } from '@prisma/client';
import { PetEquipmentDataDto } from 'src/common/dto/pet-equipment.dto';

export function convertPetEquipmentToDto(petEquipments: PetEquipment[]): PetEquipmentDataDto[] {
  return petEquipments.map((pet) => ({
    petNo: pet.petNo,
    petInfo: {
      petName: pet.petName,
      petNickname: pet.petNickname,
      petIcon: pet.petIcon,
      petDescription: pet.petDescription,
      petType: pet.petType ?? null,
      petSkills: typeof pet.petSkills === 'string' ? JSON.parse(pet.petSkills) : [],
      petDateExpire: pet.petDateExpire ? pet.petDateExpire.toISOString() : null,
      petAppearance: pet.petAppearance,
      petAppearanceIcon: pet.petAppearanceIcon,
      petEquipment: pet.itemName
        ? {
            // pet_equipment가 존재할 경우에만 매핑
            itemName: pet.itemName,
            itemIcon: pet.itemIcon,
            itemDescription: pet.itemDescription,
            scrollUpgrade: pet.scrollUpgrade,
            scrollUpgradable: pet.scrollUpgradable,
            itemShape: pet.itemShape,
            itemShapeIcon: pet.itemShapeIcon,
            attackPower: pet.attackPower,
            magicPower: pet.magicPower,
          }
        : null,
      petAutoSkill: pet.autoSkill1
        ? {
            // pet_auto_skill이 존재할 경우에만 매핑
            skill1: pet.autoSkill1,
            skill1Icon: pet.autoSkill1Icon,
            skill2: pet.autoSkill2 ?? null,
            skill2Icon: pet.autoSkill2Icon ?? null,
          }
        : null,
    },
  }));
}

export function convertPetEquipmentToEntity(
  petDto: PetEquipmentDataDto,
): Omit<Prisma.PetEquipmentCreateInput, 'character'> {
  const { petInfo } = petDto;
  return {
    petNo: petDto.petNo,
    petName: petInfo.petName,
    petNickname: petInfo.petNickname,
    petIcon: petInfo.petIcon,
    petDescription: petInfo.petDescription,
    itemName: petInfo.petEquipment?.itemName,
    itemIcon: petInfo.petEquipment?.itemIcon,
    itemDescription: petInfo.petEquipment?.itemDescription,
    attackPower: petInfo.petEquipment?.attackPower,
    magicPower: petInfo.petEquipment?.magicPower,
    scrollUpgrade: petInfo.petEquipment?.scrollUpgrade,
    scrollUpgradable: petInfo.petEquipment?.scrollUpgradable,
    itemShape: petInfo.petEquipment?.itemShape,
    itemShapeIcon: petInfo.petEquipment?.itemShapeIcon,
    autoSkill1: petInfo.petAutoSkill?.skill1,
    autoSkill1Icon: petInfo.petAutoSkill?.skill1Icon,
    autoSkill2: petInfo.petAutoSkill?.skill2,
    autoSkill2Icon: petInfo.petAutoSkill?.skill2Icon,
    petSkills: petInfo.petSkills ? JSON.stringify(petInfo.petSkills) : '[]',
    petType: petInfo.petType,
    petDateExpire: petInfo.petDateExpire ? new Date(petInfo.petDateExpire) : null,
    petAppearance: petInfo.petAppearance,
    petAppearanceIcon: petInfo.petAppearanceIcon,
  };
}
