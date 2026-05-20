#!/usr/bin/env python3
import sys, re, urllib.request, urllib.parse, http.cookiejar, json, os

BASE = 'https://browsx.com'
MY_ACCOUNT = BASE + '/my-account/'
RESELLER = BASE + '/reseller-dashboard/'
AJAX = BASE + '/wp-admin/admin-ajax.php'
PARENT_ID = '503'  # AI Organizer reseller license

LICENSE_MAP = {
    'basic': 'standard',
    'standard': 'standard',
    'pro': 'enhanced',
    'professional': 'enhanced',
    'enhanced': 'enhanced',
    'enterprise': 'ultimate',
    'ultimate': 'ultimate',
    '1': 'standard',
    '3': 'enhanced',
    '5': 'ultimate',
}


def fail(msg, code=1):
    print(msg, file=sys.stderr)
    sys.exit(code)


def build_opener():
    jar = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def get(url, opener):
    return opener.open(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode('utf-8', 'ignore')


def post(url, data, opener, headers=None):
    hdrs = {'User-Agent': 'Mozilla/5.0'}
    if headers:
        hdrs.update(headers)
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body, headers=hdrs)
    return opener.open(req, timeout=30).read().decode('utf-8', 'ignore')


def login(opener, username, password):
    html = get(MY_ACCOUNT, opener)
    nonce = re.search(r'name="woocommerce-login-nonce" value="([^"]+)"', html)
    ref = re.search(r'name="_wp_http_referer" value="([^"]+)"', html)
    if not nonce:
        fail('Could not find WooCommerce login nonce.')
    payload = {
        'username': username,
        'password': password,
        'woocommerce-login-nonce': nonce.group(1),
        '_wp_http_referer': ref.group(1) if ref else '/my-account/',
        'login': 'Log in',
    }
    body = post(MY_ACCOUNT, payload, opener)
    if 'customer-logout' not in body.lower() and 'woocommerce-MyAccount-navigation' not in body:
        # Some logins redirect; verify with follow-up page load.
        acct = get(MY_ACCOUNT, opener)
        if 'customer-logout' not in acct.lower() and 'woocommerce-MyAccount-navigation' not in acct:
            fail('BrowsX login failed.')


def get_nonce(opener):
    html = get(RESELLER, opener)
    m = re.search(r'var celmData = \{"ajaxUrl":"[^"]+","nonce":"([^"]+)"\}', html)
    if not m:
        fail('Could not find celmData nonce on reseller dashboard.')
    return m.group(1)


def provision(opener, nonce, email, license_type):
    payload = {
        'action': 'celm_generate_sublicense',
        'nonce': nonce,
        'parent_license_id': PARENT_ID,
        'license_type': license_type,
        'customer_email': email,
    }
    body = post(AJAX, payload, opener, headers={'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'})
    try:
        data = json.loads(body)
    except Exception:
        fail('Non-JSON response from BrowsX AJAX:\n' + body[:1000])
    return data


def main():
    if len(sys.argv) != 3:
        print('Usage: browsx_provision_ai_organizer.py <email> <basic|pro|enterprise>')
        sys.exit(2)

    email = sys.argv[1].strip()
    tier = sys.argv[2].strip().lower()
    license_type = LICENSE_MAP.get(tier)
    if not license_type:
        fail('Unknown tier. Use basic, standard, pro, professional, enhanced, enterprise, or ultimate.')

    user = os.environ.get('BROWSX_USER')
    pwd = os.environ.get('BROWSX_PASS')
    if not user or not pwd:
        fail('Set BROWSX_USER and BROWSX_PASS in the environment before running.')

    opener = build_opener()
    login(opener, user, pwd)
    nonce = get_nonce(opener)
    result = provision(opener, nonce, email, license_type)
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
