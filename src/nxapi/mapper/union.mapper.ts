import { UnionDto } from 'src/common/dto/union.dto';
import { NxapiUnion } from '../type/nxapi-union.type';

export const unionMapper = (unionData: NxapiUnion): UnionDto => {
  const union: UnionDto = {
    unionLevel: unionData.union_level,
    unionArtifactLevel: unionData.union_artifact_level,
    unionArtifactExp: unionData.union_artifact_exp,
    unionArtifactPoint: unionData.union_artifact_point,
  };
  return union;
};
