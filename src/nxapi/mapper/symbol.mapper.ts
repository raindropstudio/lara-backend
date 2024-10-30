import { SymbolDto } from 'src/common/dto/symbol.dto';
import { NxapiSymbolData, NxapiSymbolInfo } from '../type/nxapi-symbol.type';

const symbolInfoMapper = (symbolData: NxapiSymbolInfo): SymbolDto => {
  const symbol: SymbolDto = {
    name: symbolData.symbol_name,
    force: parseInt(symbolData.symbol_force),
    level: symbolData.symbol_level,
    str: parseInt(symbolData.symbol_str),
    dex: parseInt(symbolData.symbol_dex),
    int: parseInt(symbolData.symbol_int),
    luk: parseInt(symbolData.symbol_luk),
    hp: parseInt(symbolData.symbol_hp),
    dropRate: symbolData.symbol_drop_rate ? parseInt(symbolData.symbol_drop_rate) : 0,
    mesoRate: symbolData.symbol_meso_rate ? parseInt(symbolData.symbol_meso_rate) : 0,
    expRate: symbolData.symbol_exp_rate ? parseInt(symbolData.symbol_exp_rate) : 0,
    growthCount: symbolData.symbol_growth_count,
    requireGrowthCount: symbolData.symbol_require_growth_count,
  };
  return symbol;
};

export const symbolMapper = (symbolData: NxapiSymbolData): SymbolDto[] => {
  return symbolData.symbol.map((symbol) => symbolInfoMapper(symbol));
};
