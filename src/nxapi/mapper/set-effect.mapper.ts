import * as objectHash from 'object-hash';
import { SetEffectDto } from 'src/common/dto/set-effect.dto';
import { NxapiSetEffect } from '../type/nxapi-set-effect.type';

export const setEffectMapper = (nxapiSetEffect: NxapiSetEffect): SetEffectDto[] => {
  return nxapiSetEffect.set_effect.map((setEffectData) => {
    const setEffect = {
      hash: '',
      setName: setEffectData.set_name,
      setOptionList: setEffectData.set_option_full.map((effect) => {
        return {
          setCount: effect.set_count,
          setOption: effect.set_option,
        };
      }),
      setCount: setEffectData.total_set_count,
    };

    setEffect.hash = objectHash.sha1(setEffect.setOptionList);

    return setEffect;
  });
};
