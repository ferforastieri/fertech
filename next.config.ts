import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const config: NextConfig = {
  allowedDevOrigins: ['192.168.15.10'],
  poweredByHeader: false,
  trailingSlash: true,
  compress: true,
  images:{remotePatterns:[{protocol:'https',hostname:'images.unsplash.com'}]},
  experimental: {
    useTypeScriptCli: false,
  },
}

const withNextIntl=createNextIntlPlugin('./i18n/request.ts')

export default withNextIntl(config)
