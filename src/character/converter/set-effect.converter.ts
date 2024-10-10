import { Prisma } from '@prisma/client';
import { SetEffectDto, SetOptionDto } from 'src/common/dto/set-effect.dto';

type SetEffectEntity = Prisma.CharacterGetPayload<{
  include: {
    setEffect: {
      include: {
        setEffect: true;
      };
    };
  };
}>['setEffect'];

export const convertSetEffectToDto = (setEffectEntity: SetEffectEntity): SetEffectDto[] => {
  return setEffectEntity.map((setEffect) => {
    return {
      hash: setEffect.setEffect.hash,
      setName: setEffect.setEffect.setName,
      setOptionList: setEffect.setEffect.setOptionList as unknown as SetOptionDto[],
      setCount: setEffect.setCount,
    };
  });
};
