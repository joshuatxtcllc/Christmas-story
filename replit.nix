{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.python3   # optional (image tooling)
    pkgs.git
  ];
}
