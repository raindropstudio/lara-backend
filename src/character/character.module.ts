import { Module } from '@nestjs/common';
import { NxapiModule } from 'src/nxapi/nxapi.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CharacterService } from './character.service';
import { AbilityRepository } from './repository/ability.repository';
import { CashEquipmentRepository } from './repository/cash-equipment.repository';
import { CharacterRepository } from './repository/character.repository';
import { HexaMatrixRepository } from './repository/hexa-matrix.repository';
import { HyperStatRepository } from './repository/hyper-stat.repository';
import { ItemEquipmentRepository } from './repository/item-equipment.repository';
import { ItemOptionRepository } from './repository/item-option.repository';
import { PetEquipmentRepository } from './repository/pet-equipment.repository';
import { SetEffectRepository } from './repository/set-effect.repository';

@Module({
  imports: [NxapiModule],
  providers: [
    CharacterService,
    PrismaService,
    CharacterRepository,
    HyperStatRepository,
    AbilityRepository,
    ItemOptionRepository,
    ItemEquipmentRepository,
    CashEquipmentRepository,
    SetEffectRepository,
    PetEquipmentRepository,
    HexaMatrixRepository,
  ],
  exports: [CharacterService],
})
export class CharacterModule {}
