/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('system_configuration').del();

  // Insert system configuration with current values from file
  await knex('system_configuration').insert([
    {
      key: 'systemName',
      value: 'LogoIpsum',
      type: 'string',
      description: 'System name displayed throughout the application'
    },
    {
      key: 'logoLight',
      value: '/uploads/logoipsum-342 (1)-1759509756807.png',
      type: 'string',
      description: 'Light mode logo path'
    },
    {
      key: 'logoDark',
      value: '/uploads/logoipsum-342-1759509752938.png',
      type: 'string',
      description: 'Dark mode logo path'
    },
    {
      key: 'loginImage',
      value: '/uploads/nathan-dumlao-lvWw_G8tKsk-unsplash-1759509769537.jpg',
      type: 'string',
      description: 'Login page background image'
    },
    {
      key: 'loginTitle',
      value: 'Welcome Back',
      type: 'string',
      description: 'Login page title'
    },
    {
      key: 'loginDescription',
      value: 'Sign in to your account to continue',
      type: 'string',
      description: 'Login page description'
    },
    {
      key: 'loginLogoMode',
      value: 'theme',
      type: 'string',
      description: 'Login logo mode: light, dark, or theme'
    },
    {
      key: 'loginLogoSize',
      value: 'large',
      type: 'string',
      description: 'Login logo size: small, medium, large, or custom'
    },
    {
      key: 'loginLogoCustomSize',
      value: '200',
      type: 'number',
      description: 'Custom login logo size in pixels'
    },
    {
      key: 'configSource',
      value: 'db',
      type: 'string',
      description: 'Configuration source: file or db'
    }
  ]);
}
