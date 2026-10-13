import request from '../request'

export interface SetHardwareInfoReq {
    brightness: number;
    contrast: number;
    horizontal_flip: boolean;
    vertical_flip: boolean;
    aec: number;
    isp_mode: number;
    grayscale: boolean;
    /* The following are optional — backend only updates fields that are present
       in the request body. They are managed on the Capture Settings page. */
    fast_capture_skip_frames?: number;
    fast_capture_resolution?: number;
    fast_capture_jpeg_quality?: number;
    capture_disable_comm?: boolean;
    capture_storage_ai?: boolean;
}
export interface SetLightConfigReq {
    mode: 'auto' | 'custom' | 'off';
    brightness_level: number;
    connected?: boolean;
    /* When true, the device keeps the light in sync with the config above
       for as long as it runs (fill light, regardless of stream viewers),
       and work-time captures stop flashing the light. Wakeup captures are
       unaffected. */
    fill_light_while_streaming?: boolean;
    custom_schedule: {
        start_hour: number;
        start_minute: number;
        end_hour: number;
        end_minute: number;
    }
}

/** FSBL persisted profile ids (see fsbl_app_common.h) */
export type SysClkProfileId = 1 | 2 | 3 | 4;

export interface SysClkConfigRes {
    valid: boolean;
    sys_clk_profile: number;
}

export interface SetSysClkConfigReq {
    sys_clk_profile: SysClkProfileId;
}

/** AEC state — GET/PUT /api/v1/isp/aec */
export interface IspAecRes {
    enable: boolean;
    exposure_compensation: number;
    exposure_target?: number;
    anti_flicker_freq?: number;
}

export interface IspAecReq {
    enable?: boolean;
    exposure_compensation?: number;
}

/** Manual sensor exposure/gain — GET/PUT /api/v1/isp/aec/manual (gain in mB, exposure in µs) */
export interface IspRangeMeta {
    min: number;
    max: number;
    unit?: string;
}

export interface IspManualExposureRes {
    gain: number;
    exposure: number;
    _meta?: {
        gain?: IspRangeMeta;
        exposure?: IspRangeMeta;
    };
}

export interface IspManualExposureReq {
    gain?: number;
    exposure?: number;
}

const hardwareManagement = {
    getHardwareInfoReq: () => request.get('/api/v1/device/image/config'),
    setHardwareInfoReq: (data: SetHardwareInfoReq) => request.post('/api/v1/device/image/config', data),
    getSysClkConfigReq: () => request.get<SysClkConfigRes>('/api/v1/device/sys-clk/config'),
    setSysClkConfigReq: (data: SetSysClkConfigReq) => request.post('/api/v1/device/sys-clk/config', data),
    getIspProfileExportReq: () => request.get('/api/v1/isp/config/export'),
    postIspProfileImportReq: (body: Record<string, unknown>) => request.post('/api/v1/isp/config/import', body),
    getIspAecReq: () => request.get<IspAecRes>('/api/v1/isp/aec'),
    putIspAecReq: (data: IspAecReq) => request.put('/api/v1/isp/aec', data),
    getIspManualExposureReq: () => request.get<IspManualExposureRes>('/api/v1/isp/aec/manual'),
    putIspManualExposureReq: (data: IspManualExposureReq) => request.put('/api/v1/isp/aec/manual', data),
    postIspConfigSaveReq: () => request.post('/api/v1/isp/config/save'),
    getLightConfigReq: () => request.get('/api/v1/device/light/config'),
    setLightConfigReq: (data: SetLightConfigReq) => request.post('/api/v1/device/light/config', data),
}

export default hardwareManagement;