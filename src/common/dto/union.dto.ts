import { Expose } from 'class-transformer';

export class UnionDto {
  @Expose()
  unionLevel: number;

  @Expose()
  unionArtifactLevel: number;

  @Expose()
  unionArtifactExp: number;

  @Expose()
  unionArtifactPoint: number;
}
