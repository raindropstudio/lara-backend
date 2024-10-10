export interface NxapiSetEffect {
  set_count: number;
  set_option: string;
}

export interface NxapiSetEffectData {
  set_name: string;
  total_set_count: number;
  set_effect_info: NxapiSetEffect[];
  set_option_full: NxapiSetEffect[];
}

export interface NxapiSetEffect {
  date: string | null;
  set_effect: NxapiSetEffectData[];
}
