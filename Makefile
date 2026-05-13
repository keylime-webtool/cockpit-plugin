PACKAGE_NAME := $(shell awk '/"name":/ {gsub(/[",]/, "", $$2); print $$2}' package.json)
VERSION := $(shell T=$$(git describe --tags 2>/dev/null) || T=0.1.0; echo $$T | tr '-' '.')
TARFILE = $(PACKAGE_NAME)-$(VERSION).tar.xz
SPEC = $(PACKAGE_NAME).spec
PREFIX ?= /usr/local
DIST_TEST = dist/manifest.json
TAR_ARGS = --sort=name --mode=go=rX,u+rw,a-s --numeric-owner --owner=0 --group=0

all: $(DIST_TEST)

$(DIST_TEST): node_modules package.json build.js $(shell find src/ -type f)
	NODE_ENV=production npm run build

node_modules: package.json
	npm ci --ignore-scripts

runtime-npm-modules.txt: node_modules
	npm ls --omit=dev --parseable 2>/dev/null | \
		sed -n 's|.*/node_modules/||p' | \
		while read -r mod; do \
			ver=$$(node -e "try{console.log(require('$$mod/package.json').version)}catch(e){}" 2>/dev/null); \
			[ -n "$$ver" ] && echo "$$mod $$ver"; \
		done | sort -u > $@

$(SPEC): packaging/$(SPEC).in runtime-npm-modules.txt
	provides=$$(awk '{print "Provides: bundled(npm(" $$1 ")) = " $$2}' runtime-npm-modules.txt); \
	awk -v p="$$provides" '{gsub(/%\{VERSION\}/, "$(VERSION)"); gsub(/%\{NPM_PROVIDES\}/, p)}1' $< > $@

watch: node_modules
	npm run watch

clean:
	rm -rf dist/
	rm -f $(SPEC) $(TARFILE) runtime-npm-modules.txt *.rpm
	rm -rf rpmbuild/ output/ build/

install:
	mkdir -p $(DESTDIR)$(PREFIX)/share/cockpit/keylime
	cp -r dist/* $(DESTDIR)$(PREFIX)/share/cockpit/keylime

devel-install: $(DIST_TEST)
	mkdir -p ~/.local/share/cockpit
	ln -snf $(CURDIR)/dist ~/.local/share/cockpit/keylime

devel-uninstall:
	rm -f ~/.local/share/cockpit/keylime

print-version:
	@echo "$(VERSION)"

dist: $(TARFILE)
	@ls -1 $(TARFILE)

$(TARFILE): export NODE_ENV = production
$(TARFILE): $(DIST_TEST) $(SPEC)
	tar --xz $(TAR_ARGS) -cf $(TARFILE) --transform 's,^,$(PACKAGE_NAME)/,' \
		--exclude node_modules \
		$$(git ls-files) Makefile packaging/ dist/ $(SPEC) runtime-npm-modules.txt

srpm: $(TARFILE) $(SPEC)
	rpmbuild -bs \
		--define "_sourcedir $(CURDIR)" \
		--define "_srcrpmdir $(CURDIR)" \
		$(SPEC)

RPMBUILD_ARGS = \
	--define "_sourcedir $(CURDIR)" \
	--define "_specdir $(CURDIR)" \
	--define "_builddir $(CURDIR)/rpmbuild" \
	--define "_srcrpmdir $(CURDIR)" \
	--define "_rpmdir $(CURDIR)/output" \
	--define "_buildrootdir $(CURDIR)/build"

rpm: $(TARFILE) $(SPEC)
	mkdir -p $(CURDIR)/output $(CURDIR)/rpmbuild
	rpmbuild -bb --nodeps $(RPMBUILD_ARGS) $(SPEC)
	find $(CURDIR)/output -name '*.rpm' -printf '%f\n' -exec mv {} . \;
	rm -rf $(CURDIR)/rpmbuild $(CURDIR)/output $(CURDIR)/build

test: node_modules
	npm run test:run

.PHONY: all clean install devel-install devel-uninstall print-version dist watch rpm srpm test
