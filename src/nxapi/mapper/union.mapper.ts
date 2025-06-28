import { UnionDto } from 'src/common/dto/union.dto';
import { NxapiUnion } from '../type/nxapi-union.type';

export const unionMapper = (unionData: NxapiUnion): UnionDto | null => {
  // unionData가 null이거나 필수 필드가 없는 경우 null 반환
  if (
    !unionData ||
    unionData.union_level == null ||
    unionData.union_artifact_level == null ||
    unionData.union_artifact_exp == null ||
    unionData.union_artifact_point == null
  ) {
    return null;
  }

  const union: UnionDto = {
    unionLevel: unionData.union_level,
    unionArtifactLevel: unionData.union_artifact_level,
    unionArtifactExp: unionData.union_artifact_exp,
    unionArtifactPoint: unionData.union_artifact_point,
  };
  return union;
};
