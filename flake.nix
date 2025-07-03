{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "aarch64-darwin";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_22
          nodePackages.pnpm
          git
        ];

        shellHook = ''
          echo "FreeLens Extension Development Environment"
          echo "Node.js: $(node --version)"
          echo "pnpm: $(pnpm --version)"
          echo ""
          echo "Ready! Run 'pnpm install' to get started."
        '';
      };
    };
}

