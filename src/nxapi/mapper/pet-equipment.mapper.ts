import { PetEquipmentDataDto } from 'src/common/dto/pet-equipment.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';
import { NxapiPetEquipmentData, NxapiPetEquipmentOption } from '../type/nxapi-pet-equipment.type';

// 옵션 값을 추출하는 함수
const extractOptionValue = (options: NxapiPetEquipmentOption[], optionType: string): number | null => {
  const option = options.find((opt) => opt.option_type === optionType);
  return option ? parseFloat(option.option_value) : null;
};

// 펫 데이터를 DTO로 변환하는 함수
export const petEquipmentMapper = (res: any): PetEquipmentDataDto[] => {
  const petDataMap: { [petNo: number]: NxapiPetEquipmentData } = {};

  // API 응답의 모든 키를 순회하며 펫 데이터를 추출
  Object.keys(res).forEach((key) => {
    const match = key.match(/^pet_(\d+)_(.+)$/);
    if (match) {
      const petNo = parseInt(match[1], 10);
      const propName = match[2];

      // 매핑 규칙 정의: API 응답 키 -> DTO 필드 이름
      const keyMap: { [key: string]: string } = {
        name: 'pet_name',
        nickname: 'pet_nickname',
        icon: 'pet_icon',
        description: 'pet_description',
        equipment: 'pet_equipment',
        auto_skill: 'pet_auto_skill',
        pet_type: 'pet_type',
        skill: 'pet_skill',
        date_expire: 'pet_date_expire',
        appearance: 'pet_appearance',
        appearance_icon: 'pet_appearance_icon',
      };

      const mappedKey = keyMap[propName];
      if (mappedKey) {
        if (!petDataMap[petNo]) {
          petDataMap[petNo] = { petNo, petInfo: {} };
        }
        petDataMap[petNo].petInfo[mappedKey] = res[key];
      }
    }
  });

  // 추출한 펫 데이터를 DTO로 변환
  const petDtos: PetEquipmentDataDto[] = Object.values(petDataMap).map((petData) => {
    const { petNo, petInfo } = petData;

    // 필수 필드가 모두 존재하는지 확인
    const requiredFields = ['pet_name', 'pet_nickname', 'pet_icon', 'pet_description'];
    const hasAllRequiredFields = requiredFields.every((field) => petInfo[field]);

    if (!hasAllRequiredFields) {
      //console.error(`펫 정보 누락 -> petNo ${petNo}:`, petInfo);
      return null; // null을 반환하여 이 데이터를 제외
    }

    return {
      petNo,
      petInfo: {
        petName: petInfo.pet_name,
        petNickname: petInfo.pet_nickname,
        petIcon: extractImageCode(petInfo.pet_icon),
        petDescription: petInfo.pet_description,
        petType: petInfo.pet_type ?? null,
        petSkills: Array.isArray(petInfo.pet_skill) ? petInfo.pet_skill : JSON.parse(petInfo.pet_skill || '[]'),
        petDateExpire: petInfo.pet_date_expire,
        petAppearance: petInfo.pet_appearance,
        petAppearanceIcon: extractImageCode(petInfo.pet_appearance_icon),
        petEquipment: petInfo.pet_equipment
          ? {
              itemName: petInfo.pet_equipment.item_name,
              itemIcon: extractImageCode(petInfo.pet_equipment.item_icon),
              itemDescription: petInfo.pet_equipment.item_description,
              scrollUpgrade: petInfo.pet_equipment.scroll_upgrade,
              scrollUpgradable: petInfo.pet_equipment.scroll_upgradable,
              itemShape: petInfo.pet_equipment.item_shape,
              itemShapeIcon: extractImageCode(petInfo.pet_equipment.item_shape_icon),
              attackPower: extractOptionValue(petInfo.pet_equipment.item_option, '공격력'),
              magicPower: extractOptionValue(petInfo.pet_equipment.item_option, '마력'),
            }
          : null,
        petAutoSkill: petInfo.pet_auto_skill
          ? {
              skill1: petInfo.pet_auto_skill.skill_1,
              skill1Icon: extractImageCode(petInfo.pet_auto_skill.skill_1_icon),
              skill2: petInfo.pet_auto_skill.skill_2 || null,
              skill2Icon: extractImageCode(petInfo.pet_auto_skill.skill_2_icon) || null,
            }
          : null,
      },
    };
  });

  // 마지막에 null 값 필터링
  return petDtos.filter((dto): dto is PetEquipmentDataDto => dto !== null);
};
