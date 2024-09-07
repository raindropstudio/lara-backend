import { Prisma } from '@prisma/client';
import { AbilityDto, AbilityInfoDto } from 'src/common/dto/ability.dto';

type AbilityEntity = Prisma.CharacterGetPayload<{
  include: {
    abilityPreset: {
      include: {
        ability: true;
      };
    };
  };
}>['abilityPreset'];
type AbilityFlatten = AbilityInfoDto & { presetNo: number; active: boolean };

export const convertAbilityToEntity = (abilityPreset: AbilityDto): AbilityFlatten[] => {
  return abilityPreset.preset
    .flatMap((abilityInfo) => {
      return abilityInfo.abilityInfo.map((ability) => {
        return {
          ...ability,
          active: abilityInfo.active,
          presetNo: abilityInfo.presetNo,
        };
      });
    })
    .concat({
      abilityGrade: 'RARE', // Dummy
      abilityValue: '_REMAIN_FAME', // Dummy
      abilityNo: abilityPreset.remainFame,
      active: false,
      presetNo: 0,
    });
};

export const convertAbilityToDto = (abilityEntity: AbilityEntity): AbilityDto => {
  if (!abilityEntity) return null;

  const abilityPresets: AbilityDto = {
    remainFame: 0, // preset 0번의 abilityNo 값
    preset: [
      { presetNo: 1, active: false, abilityInfo: [] },
      { presetNo: 2, active: false, abilityInfo: [] },
      { presetNo: 3, active: false, abilityInfo: [] },
    ],
  };

  abilityEntity.forEach((ab) => {
    if (ab.presetNo === 0) {
      abilityPresets.remainFame = ab.abilityNo;
    }

    const preset = abilityPresets.preset.find((p) => p.presetNo === ab.presetNo);
    if (preset) {
      preset.active = ab.active; // 활성화 여부 설정
      preset.abilityInfo.push({
        abilityNo: ab.abilityNo,
        abilityGrade: ab.ability.abilityGrade,
        abilityValue: ab.ability.abilityValue,
      });
    }
  });

  return abilityPresets;
};
