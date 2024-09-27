import registerPathHandler from './PathHandler'
import RegisterPlatformHandler from './PlatformHandler'

export default function registerHandlers(): void {
  registerPathHandler()
  RegisterPlatformHandler()
}
