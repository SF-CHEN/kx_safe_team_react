/**
 * [INPUT]: 由 OpenAPI 的 sys-file paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 sys-file 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel2SysFileParams,
  DeleteOne2SysFileParams,
  DownloadSysFileParams,
  GetDetailById2SysFileParams,
  PageQuery,
  ResultBoolean,
  ResultPageSysFile,
  ResultSysFile,
} from './types/sys-file'
import { requestData } from '@/api/request'

/** 文件上传，支持zip/rar/7z/tar/csv/json/jsonl，最大50MB */
export function uploadSysFile(data: Record<string, unknown>): Promise<ResultSysFile> {
  return requestData<ResultSysFile>({
    url: `/temp/sys-file/upload`,
    method: 'POST',
    data,
  })
}

/** 分页查询文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录 */
export function findPage2SysFile(data: PageQuery): Promise<ResultPageSysFile> {
  return requestData<ResultPageSysFile>({
    url: `/temp/sys-file/page`,
    method: 'POST',
    data,
  })
}

/** 获取文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录 */
export function getDetailById2SysFile(params: GetDetailById2SysFileParams): Promise<ResultSysFile> {
  return requestData<ResultSysFile>({
    url: `/temp/sys-file/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 文件下载 */
export function downloadSysFile(params: DownloadSysFileParams): Promise<void> {
  return requestData<void>({
    url: `/temp/sys-file/download`,
    method: 'GET',
    params,
  })
}

/** 删除文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录 */
export function deleteOne2SysFile(params: DeleteOne2SysFileParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-file/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录 */
export function batchDel2SysFile(params: BatchDel2SysFileParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-file/batchDel`,
    method: 'DELETE',
    params,
  })
}
