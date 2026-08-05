import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const config: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  compress: true,
}

const withNextIntl=createNextIntlPlugin('./i18n/request.ts')

export default withNextIntl(config)
