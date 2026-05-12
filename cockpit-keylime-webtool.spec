Name:           cockpit-keylime-webtool
Version:        0.1.0
Release:        1%{?dist}
Summary:        Cockpit plugin for Keylime Webtool monitoring dashboard
License:        Apache-2.0
URL:            https://github.com/keylime-webtool/cockpit-keylime-webtool
Source0:        %{name}-%{version}.tar.gz

BuildArch:      noarch
BuildRequires:  nodejs >= 20
BuildRequires:  npm

Requires:       cockpit-bridge >= 300
Requires:       keylime

%description
A Cockpit plugin that provides the Keylime Webtool monitoring dashboard
inside the Cockpit web console, communicating with keylime-webtool-backend.

%prep
%setup -q

%build
npm ci --ignore-scripts
NODE_ENV=production npm run build

%install
mkdir -p %{buildroot}%{_datadir}/cockpit/keylime
cp -a dist/* %{buildroot}%{_datadir}/cockpit/keylime/

%files
%license LICENSE
%doc README.md
%{_datadir}/cockpit/keylime/
